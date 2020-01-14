import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { IdPipe } from './id.pipe';

@Injectable()
export class ArrayOfIdPipe implements PipeTransform {
  idPipe = new IdPipe();
  async transform(value: any, metadata: ArgumentMetadata): Promise<number[]> {
    if (value === undefined) {
      return [];
    }
    if (!Array.isArray(value)) {
      return [await this.idPipe.transform(value, metadata)];
    } else {
      return await Promise.all(value.map(item => this.idPipe.transform(item, metadata)));
    }
  }
}
