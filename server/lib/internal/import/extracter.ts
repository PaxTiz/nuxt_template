import type { DataImporter } from '#shared/types';
import { Service } from '../../service';

export class DataExtracter extends Service {
  async demo(buffer: Buffer): Promise<DataImporter['Demo']> {
    return [
      {
        id: 0,
        name: 'John Doe',
      },
    ];
  }
}
