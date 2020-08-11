import { SetMetadata } from '@nestjs/common';

export const OnlyBoundOrder = () => SetMetadata('onlyBoundOrder', true);
