import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class QuoteModel {
  @Field(() => String)
  quoteId: string;
  @Field(() => Number)
  price: number;
  @Field(() => String)
  expiresAt: string;
}
