import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { Observable, Subscriber } from 'rxjs';
const pptxgen = require('pptxgenjs');

type UniversityItem = {
  name: string;
  img: string;
  link: string;
  desc?: string;
};
let cache: UniversityItem[] | null = null;
@Injectable()
export class PptGenerateService {
  getUniversityData() {
    if (cache) {
      return cache;
    }

    async function getData(observer: Subscriber<{ data: UniversityItem }>) {
      const browser = await puppeteer.launch({
        headless: true,
        executablePath:
          '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        defaultViewport: {
          width: 0,
          height: 0,
        },
      });

      const page = await browser.newPage();

      await page.goto('https://www.icourse163.org/university/view/all.htm');

      // 出现类名为u-usitys则成功加载了页面
      await page.waitForSelector('.u-usitys');

      // 获取大学列表中的一个个item，并拿到大学名称与图片
      const universityList = (await page.$eval('.u-usitys', (el) => {
        return [...el.querySelectorAll('.u-usity')].map((item) => {
          return {
            name: item.querySelector('img')?.alt || '',
            img: '',
            link: item.getAttribute('href') || '',
          };
        });
      })) as UniversityItem[];

      const ppt = new pptxgen();
      // 获取到每个大学的详情页的描述信息
      for (let i = 0; i < universityList.length; i++) {
        const item = universityList[i];
        await page.goto('https://www.icourse163.org' + item.link);

        await page.waitForSelector('.m-cnt');
        // 获取大学简介
        const content = await page.$eval('.m-cnt p', (el) => el.textContent);
        item.desc = content;

        // 获取大学logo
        item.img =
          (await page.$eval('.g-doc img', (el) => el.getAttribute('src'))) ||
          '';
        observer.next({ data: item });

        // 添加幻灯片放入大学名称、logo、简介信息
        const slide = ppt.addSlide();
        slide.addText(item.name, {
          x: '10%',
          y: '10%',
          color: '#ff0000',
          fontSize: 30,
          align: ppt.AlignH.center,
        });

        slide.addImage({
          path: item.img,
          x: '42%',
          y: '25%',
        });

        slide.addText(item.desc, {
          x: '10%',
          y: '60%',
          color: '#000000',
          fontSize: 14,
        });
      }

      await browser.close();

      await ppt.writeFile({
        fileName: '中国所有大学.pptx',
      });

      cache = universityList;
    }

    return new Observable((observer) => {
      getData(observer);
    });
  }
}
