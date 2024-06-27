// User-land modules.
import { Container, decorate, inject, injectable } from 'inversify'
import 'reflect-metadata'

// Application modules.
import { NetflixController } from '../controllers/NetlixController.js'
import { NetflixModel } from '../models/NetflixModel.js'
import { MongooseRepositoryBase } from '../repositories/MongooseRepositoryBase.js'
import { NetflixRepository } from '../repositories/NetflixRepository.js'
import { MongooseServiceBase } from '../services/MongooseServiceBase.js'
import { NetflixService } from '../services/NetflixService.js'
import { ChartController } from '../controllers/ChartController.js'

// Define the types to be used by the IoC container.
export const NETFLIXTYPES = {
  NetflixController: Symbol.for('NetflixController'),
  NetflixRepository: Symbol.for('NetflixRepository'),
  NetflixService: Symbol.for('NetflixService'),
  NetflixModelClass: Symbol.for('NetflixModelClass')
}

export const CHARTTYPES = {
  ChartController: Symbol.for('ChartController')
}

// Declare the injectable and its dependencies.
decorate(injectable(), MongooseRepositoryBase)
decorate(injectable(), MongooseServiceBase)
decorate(injectable(), NetflixRepository)
decorate(injectable(), NetflixService)
decorate(injectable(), NetflixController)
decorate(injectable(), ChartController)

decorate(inject(NETFLIXTYPES.NetflixModelClass), NetflixRepository, 0)
decorate(inject(NETFLIXTYPES.NetflixRepository), NetflixService, 0)
decorate(inject(NETFLIXTYPES.NetflixService), NetflixController, 0)

// Create the IoC container.
export const container = new Container()

// Declare the bindings.
container.bind(NETFLIXTYPES.NetflixController).to(NetflixController).inSingletonScope()
container.bind(NETFLIXTYPES.NetflixRepository).to(NetflixRepository).inSingletonScope()
container.bind(NETFLIXTYPES.NetflixService).to(NetflixService).inSingletonScope()
container.bind(NETFLIXTYPES.NetflixModelClass).toConstantValue(NetflixModel)

container.bind(CHARTTYPES.ChartController).to(ChartController).inSingletonScope()
