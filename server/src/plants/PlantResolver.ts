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
    const plant = await this.plantService.getPlants();
    const temp = [];
    for (let i = 0; i < 20; i += 1) {
      temp.push(plant[0]);
    }
    return temp;
  }

  @Query(returns => Plant)
  plant(@Arg('plantId', type => Number) plantId: number) {
    return this.plantService.getPlant(plantId);
  }
}

export default PlantResolver;
