import { Injectable, Logger, HttpException, HttpStatus, forwardRef, Inject } from "@nestjs/common"
import { HttpService } from "@nestjs/axios"
import { firstValueFrom } from "rxjs"
import { EquipoPokemon } from "../models/equipo"
import { Pokemon } from "../models/pokemon.model"
import { PokemonService } from "./pokemon.service"
import { FirebaseService } from "../modules/services/firebase/firebase.service"
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  updateDoc,
  type Firestore,
} from "firebase/firestore"

@Injectable()
export class EquipoService {
  private readonly logger = new Logger(EquipoService.name)
  private readonly entrenadorServiceUrl = "http://localhost:8000/api/entrenadores"
  private readonly db: Firestore
  private readonly equiposCollection = "equipos-pokemon"

  constructor(
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => PokemonService))
    private readonly pokemonService: PokemonService,
    @Inject(FirebaseService)
    private readonly firebaseService: FirebaseService,
  ) {
    this.db = this.firebaseService.getFirestoreInstance()
    this.logger.log("Servicio de equipos inicializado con Firestore")
  }

  private async getPokemonFromService(pokemonId: number): Promise<Pokemon> {
    try {
      const pokemon = await this.pokemonService.obtenerPokemonPorId(pokemonId)
      return pokemon
    } catch (error) {
      console.error("Error al obtener Pokemon:", error.response?.data)
      throw new HttpException(`Pokemon con ID ${pokemonId} no encontrado`, HttpStatus.NOT_FOUND)
    }
  }

  private async getEntrenadorInfo(entrenadorId: string): Promise<any> {
    try {
      const numericId = Number.parseInt(entrenadorId)
      if (isNaN(numericId)) {
        throw new HttpException("ID de entrenador inválido", HttpStatus.BAD_REQUEST)
      }

      // Obtener la lista completa de entrenadores
      const response = await firstValueFrom(this.httpService.get(this.entrenadorServiceUrl))

      // Buscar el entrenador específico por ID
      const entrenador = response.data.entrenadores.find((e) => e.id === numericId)
      if (!entrenador) {
        throw new HttpException("Entrenador no encontrado", HttpStatus.NOT_FOUND)
      }

      return entrenador
    } catch (error) {
      console.error("Error al obtener entrenador:", error.response?.data)
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException("Error al obtener información del entrenador", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  private async verificarEntrenador(entrenadorId: string): Promise<boolean> {
    try {
      // Convertir el ID a número
      const numericId = Number.parseInt(entrenadorId)
      if (isNaN(numericId)) {
        return false
      }
      await firstValueFrom(this.httpService.get(`${this.entrenadorServiceUrl}/${numericId}`))
      return true
    } catch (error) {
      return false
    }
  }

  // Método para generar un ID único para el equipo
  private generateEquipoId(entrenadorId: string): string {
    return `${entrenadorId}-${Date.now()}`
  }

  // Método para convertir un documento de Firestore a un objeto EquipoPokemon
  private async documentToEquipo(docData: any): Promise<EquipoPokemon> {
    try {
      // Obtener los Pokémon del equipo
      const pokemones = await Promise.all(docData.pokemonIds.map((id) => this.getPokemonFromService(id)))

      return new EquipoPokemon(docData.equipoId, docData.nombre, pokemones)
    } catch (error) {
      this.logger.error(`Error al convertir documento a equipo: ${error.message}`)
      throw error
    }
  }

  async crearEquipo(entrenadorId: string, nombre: string, pokemonIds: number[]): Promise<any> {
    try {
      const numericId = Number.parseInt(entrenadorId)
      if (isNaN(numericId)) {
        throw new HttpException("ID de entrenador inválido", HttpStatus.BAD_REQUEST)
      }

      // Obtener la lista de entrenadores y buscar el específico
      const entrenador = await this.getEntrenadorInfo(entrenadorId)

      // Verificar límite de 6 Pokemon por equipo
      if (pokemonIds.length > 6) {
        throw new HttpException("Un equipo no puede tener más de 6 Pokemon", HttpStatus.BAD_REQUEST)
      }

      // Verificar que los Pokémon existan
      await Promise.all(pokemonIds.map((id) => this.getPokemonFromService(id)))

      // Generar un ID único para el equipo
      const equipoId = Number.parseInt(this.generateEquipoId(entrenadorId).split("-")[1])

      // Crear el documento en Firestore
      const equipoRef = doc(this.db, this.equiposCollection, `${entrenadorId}-${equipoId}`)

      // Asegurarse de que todos los datos sean serializables
      const equipoData = {
        equipoId: Number(equipoId),
        entrenadorId: Number(numericId),
        nombre: String(nombre),
        pokemonIds: pokemonIds.map(id => Number(id)),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      try {
        await setDoc(equipoRef, equipoData)
        this.logger.log(`Equipo creado con ID: ${equipoId} para entrenador: ${entrenadorId}`)
      } catch (error) {
        this.logger.error(`Error al guardar en Firestore: ${error.message}`, error.stack)
        throw new HttpException(`Error al guardar equipo en la base de datos: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR)
      }

      // Obtener los Pokémon para la respuesta
      const pokemones = await Promise.all(pokemonIds.map((id) => this.getPokemonFromService(id)))

      const equipo = new EquipoPokemon(equipoId, nombre, pokemones)

      return {
        entrenador,
        equipos: equipo,
      }
    } catch (error) {
      this.logger.error(`Error al crear equipo: ${error.message}`)
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(`Error al crear equipo: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async obtenerEquipos(entrenadorId: string): Promise<any> {
    try {
      const numericId = Number.parseInt(entrenadorId)
      if (isNaN(numericId)) {
        throw new HttpException("ID de entrenador inválido", HttpStatus.BAD_REQUEST)
      }

      // Obtener el entrenador
      const entrenador = await this.getEntrenadorInfo(entrenadorId)

      // Consultar equipos del entrenador en Firestore
      const equiposRef = collection(this.db, this.equiposCollection)
      const q = query(equiposRef, where("entrenadorId", "==", numericId))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        return {
          entrenador,
          equipos: [],
        }
      }

      // Convertir documentos a objetos EquipoPokemon
      const equipos = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          return this.documentToEquipo(doc.data())
        }),
      )

      return {
        entrenador,
        equipos,
      }
    } catch (error) {
      this.logger.error(`Error al obtener equipos: ${error.message}`)
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(`Error al obtener equipos: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async obtenerEquipo(entrenadorId: string, equipoId: string): Promise<any> {
    try {
      const numericEntrenadorId = Number.parseInt(entrenadorId)
      const numericEquipoId = Number.parseInt(equipoId)

      if (isNaN(numericEntrenadorId) || isNaN(numericEquipoId)) {
        throw new HttpException("ID inválido", HttpStatus.BAD_REQUEST)
      }

      // Obtener el entrenador
      const entrenador = await this.getEntrenadorInfo(entrenadorId)

      // Obtener el equipo de Firestore
      const equipoRef = doc(this.db, this.equiposCollection, `${entrenadorId}-${equipoId}`)
      const equipoDoc = await getDoc(equipoRef)

      if (!equipoDoc.exists()) {
        throw new HttpException("Equipo no encontrado", HttpStatus.NOT_FOUND)
      }

      const equipo = await this.documentToEquipo(equipoDoc.data())

      return {
        entrenador,
        equipos: equipo,
      }
    } catch (error) {
      this.logger.error(`Error al obtener equipo: ${error.message}`)
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(`Error al obtener equipo: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async actualizarEquipo(entrenadorId: string, equipoId: string, nombre: string, pokemonIds: number[]): Promise<any> {
    try {
      const numericEntrenadorId = Number.parseInt(entrenadorId)
      const numericEquipoId = Number.parseInt(equipoId)

      if (isNaN(numericEntrenadorId) || isNaN(numericEquipoId)) {
        throw new HttpException("ID inválido", HttpStatus.BAD_REQUEST)
      }

      // Verificar cantidad de pokémon
      if (pokemonIds.length > 6) {
        throw new HttpException("Un equipo no puede tener más de 6 Pokémon", HttpStatus.BAD_REQUEST)
      }

      // Obtener información del entrenador
      const entrenador = await this.getEntrenadorInfo(entrenadorId)

      // Verificar que el equipo existe
      const equipoRef = doc(this.db, this.equiposCollection, `${entrenadorId}-${equipoId}`)
      const equipoDoc = await getDoc(equipoRef)

      if (!equipoDoc.exists()) {
        throw new HttpException("Equipo no encontrado", HttpStatus.NOT_FOUND)
      }

      // Verificar que los Pokémon existen
      await Promise.all(pokemonIds.map((id) => this.getPokemonFromService(id)))

      // Actualizar el equipo en Firestore
      const equipoData = {
        nombre,
        pokemonIds,
        updatedAt: new Date().toISOString(),
      }

      await updateDoc(equipoRef, equipoData)

      // Obtener los Pokémon para la respuesta
      const pokemones = await Promise.all(pokemonIds.map((id) => this.getPokemonFromService(id)))

      const equipoActualizado = new EquipoPokemon(numericEquipoId, nombre, pokemones)

      return {
        entrenador,
        equipos: equipoActualizado,
      }
    } catch (error) {
      this.logger.error(`Error al actualizar equipo: ${error.message}`)
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(`Error al actualizar equipo: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async eliminarEquipo(entrenadorId: string, equipoId: string): Promise<void> {
    try {
      const numericEntrenadorId = Number.parseInt(entrenadorId)
      const numericEquipoId = Number.parseInt(equipoId)

      if (isNaN(numericEntrenadorId) || isNaN(numericEquipoId)) {
        throw new HttpException("ID inválido", HttpStatus.BAD_REQUEST)
      }

      // Verificar que el equipo existe
      const equipoRef = doc(this.db, this.equiposCollection, `${entrenadorId}-${equipoId}`)
      const equipoDoc = await getDoc(equipoRef)

      if (!equipoDoc.exists()) {
        throw new HttpException("Equipo no encontrado", HttpStatus.NOT_FOUND)
      }

      // Eliminar el equipo de Firestore
      await deleteDoc(equipoRef)
    } catch (error) {
      this.logger.error(`Error al eliminar equipo: ${error.message}`)
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(`Error al eliminar equipo: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async obtenerTodosLosEntrenadores(): Promise<any[]> {
    try {
      // Obtener todos los entrenadores
      const response = await firstValueFrom(this.httpService.get(this.entrenadorServiceUrl))
      const entrenadores: any[] = response.data.entrenadores || response.data

      if (!Array.isArray(entrenadores)) {
        throw new Error("No se pudo obtener la lista de entrenadores")
      }

      // Para cada entrenador, obtener sus equipos
      return await Promise.all(
        entrenadores.map(async (entrenador) => {
          const entrenadorId = entrenador.id.toString()

          // Consultar equipos del entrenador en Firestore
          const equiposRef = collection(this.db, this.equiposCollection)
          const q = query(equiposRef, where("entrenadorId", "==", entrenador.id))
          const querySnapshot = await getDocs(q)

          let equipos: EquipoPokemon[] = [];
          if (!querySnapshot.empty) {
            equipos = await Promise.all(
              querySnapshot.docs.map(async (doc) => {
                return this.documentToEquipo(doc.data())
              }),
            )
          }

          return {
            entrenador: {
              id: entrenador.id,
              nombre: entrenador.nombre,
              edad: entrenador.edad,
              sexo: entrenador.sexo,
            },
            equipos,
          }
        }),
      )
    } catch (error) {
      this.logger.error(`Error al obtener todos los entrenadores: ${error.message}`)
      throw new HttpException(
        `Error al obtener los entrenadores: ${error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}

