import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, } from 'class-validator';

export class ScrapUrlDto {

    @IsUrl()
    @IsString()
    @ApiProperty({ example: 'https://appinventiv.com/' })
    url: string;

    @IsString()
    @ApiProperty({ example: 'h1' })
    selector: string;

}