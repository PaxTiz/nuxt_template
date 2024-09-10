import type { DataImporter } from '~/types';
import { Service } from '../../service';

export default class DataExtracter extends Service {
  async demo(buffer: Buffer): Promise<DataImporter['Demo']> {
    return [
      {
        id: 0,
        name: 'John Doe',
      },
    ];
  }
}
