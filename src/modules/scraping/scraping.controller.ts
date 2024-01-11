import { Controller, Post, Body, Res, Logger } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { ScrapUrlDto } from './dto/scrap.url.dto';
import { Response } from 'express';
import { ApiOperation } from '@nestjs/swagger';
import { responseUtils } from 'src/utils/reponse.util';
import { ExceptionMessage, HttpStatusMessage, MSG, SuccessMessage } from 'src/interface/enum';



@Controller('scraping')
export class ScrapingController {

    private readonly logger = new Logger();

    constructor(
        private readonly scrapingService: ScrapingService,
    ) { }


    /**
    * Scrapes data from a URL using a selector.
    *
    * @route POST /
    * @summary Scrape Data
    * @description Endpoint to scrape data from a specified URL using a CSS selector.
    * @param {ScrapUrlDto} scrapUrlDto - The data for scraping the URL.
    * @param {Response} res - The HTTP response object for sending the result.
    * @returns {Promise<void>} A Promise that resolves when the data scrape successfully.
    */
    @Post()
    @ApiOperation({
        summary: 'Scrape data from a URL using a selector',
        description: 'Provide the URL and selector in the request body.',
    })
    async scrapeUrl(@Body() scrapUrlDto: ScrapUrlDto, @Res() res: Response): Promise<void> {

        const { url, selector } = scrapUrlDto;
        try {

            const response = await this.scrapingService.scrapeUrl(url, selector);
            this.logger.log(MSG.SUCCESS, { url, selector, response });
            let finalResponse = responseUtils.successResponse(
                response,
                SuccessMessage.DATA_SCRABE_SUCCESSFULLY,
                HttpStatusMessage.OK
            )
            res.status(finalResponse.code).send(finalResponse);

        } catch (error) {

            this.logger.error(MSG.ERROR, { url, selector, error })
            let err = responseUtils.errorResponse(
                error,
                ExceptionMessage.ERROR_IN_DATA_SCRABE,
            );
            res.status(err.code).send(err);

        }
    }

}
