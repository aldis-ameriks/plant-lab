import { Arg, Query, Resolver } from 'type-graphql';
import { Plant } from './PlantEntity';
import { PlantService } from './PlantService';

@Resolver(Plant)
class PlantResolver {
  private readonly plantService: PlantService;

  constructor() {
    this.plantService = new PlantService();
  }

  @Query(returns => [Plant])
  async plants() {
    return this.plantService.getPlants();
  }

  @Query(returns => Plant)
  plant(@Arg('plantId', type => String) plantId: string) {
    return this.plantService.getPlant(plantId);
  }
}

export default PlantResolver;
