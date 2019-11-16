import { Query, Resolver } from 'type-graphql';
import { Plant } from './PlantEntity';
import { PlantService } from './PlantService';

@Resolver(Plant)
class PlantResolver {
  private readonly plantService: PlantService;

  constructor() {
    this.plantService = new PlantService();
  }

  @Query(returns => [Plant])
  plants() {
    return this.plantService.getPlants();
  }
}

export default PlantResolver;
