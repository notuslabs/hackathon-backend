import { Args, Field, ObjectType, Query, Resolver } from "@nestjs/graphql";
import { GetAccountAbstractionAddressByOwnerService } from "src/services/GetAccountAbstractionAddressByOwnerService";
import { Hexadecimal } from "src/types/hexadecimal";
import { HexadecimalScalar } from "../scalars/Hexadecimal";

@ObjectType()
export class GetAccountAbstractionAddressByOwnerOutput {
	@Field(() => HexadecimalScalar)
	accountAbstractionAddress: Hexadecimal;
}

@Resolver()
export class GetAccountAbstractionAddressByOwnerResolver {
	constructor(
		private getAccountAbstractionAddressByOwnerService: GetAccountAbstractionAddressByOwnerService,
	) {}

	@Query(() => GetAccountAbstractionAddressByOwnerOutput)
	async accountAbstractionAddressByOwner(
		@Args("owner", { type: () => HexadecimalScalar }) owner: Hexadecimal,
	): Promise<GetAccountAbstractionAddressByOwnerOutput> {
		const accountAbstractionAddress =
			await this.getAccountAbstractionAddressByOwnerService.execute({
				owner,
			});

		return {
			accountAbstractionAddress,
		};
	}
}
