import { Injectable } from '@nestjs/common';
import { SimpleAccountFactoryAbi } from 'src/abis/SimpleAccountFactory';
import { FACTORY_ADDRESS } from 'src/constants';
import { Hexadecimal } from 'src/types/hexadecimal';
import { PublicClient, createPublicClient, getContract, http } from 'viem';
import { polygon, polygonMumbai } from 'viem/chains';

export type GetAccountAbstractionAddressByOwnerInput = {
  owner: Hexadecimal;
};

@Injectable()
export class GetAccountAbstractionAddressByOwnerService {
  #client: PublicClient;
  constructor() {
    this.#client = createPublicClient({
      chain: process.env.NODE_ENV === 'production' ? polygon : polygonMumbai,
      transport: http(process.env.ALCHEMY_HTTP_API_URL),
    });
  }

  async execute({ owner }: GetAccountAbstractionAddressByOwnerInput) {
    const factoryContract = getContract({
      abi: SimpleAccountFactoryAbi,
      address: FACTORY_ADDRESS,
      publicClient: this.#client,
    });

    const address = await factoryContract.read.getAddress([owner, 0n]);

    return address;
  }
}
