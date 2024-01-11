
import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import axios from 'axios';
import { CustomException } from 'src/utils/exception.util';
import { promises } from 'dns';
import { ExceptionMessage, HttpStatusMessage } from 'src/interface/enum';


@Injectable()
export class ScrapingService {

    /**
    * Scrapes data from a URL using a selector.
    *
    * @param {string} url - The URL to scrape data from.
    * @param {string} selector - The CSS selector to target the desired data.
    * @returns {Promise<any>} A Promise that resolves with the scraped data.
    * @throws {Error} Throws an error if there is an issue during the scraping.
    */
    async scrapeUrl(url: string, selector: string): Promise<any> {
        try {

            if (!await this.isValidUrl(url)) {
                throw new CustomException(ExceptionMessage.INVALID_DOMAIN_NAME, HttpStatusMessage.NOT_FOUND).getError();
            }

            const response = await axios.get(url);

            if (response.status !== 200) {
                throw new CustomException(ExceptionMessage.FAIL_TO_FETCH_DATA, HttpStatusMessage.NOT_FOUND).getError();
            }

            const $ = cheerio.load(response.data);

            let selectedData: string[];

            switch (selector) {
                case 'img':
                    selectedData = $(selector).map((_, element) => $(element).attr('src')).get();
                    break;
                case 'a':
                    selectedData = $(selector).map((_, element) => $(element).attr('href')).get();
                    break;
                default:
                    selectedData = $(selector).map((_, element) => $(element).text().trim()).get().filter(Boolean);
                    break;
            }

            if (selectedData.length === 0) {
                throw new CustomException(ExceptionMessage.NO_DATA_FOUND_WITH_PROVIDED_SELECTOR, HttpStatusMessage.NOT_FOUND).getError();
            }

            return selectedData;
        } catch (error) {
            throw error;
        }
    }


    private async isValidUrl(url: string): Promise<boolean> {

        const { hostname } = new URL(url);
        try {
            await promises.lookup(hostname);
            return true;
        } catch (error) {
            return false;
        }
    }
}
