import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'langFilter'
})

export class LangFilterPipe implements PipeTransform {

  transform(value: any): any {
    try {
      let userlang: string = JSON.parse(window.sessionStorage.getItem("oauth")).lang;
      if (userlang != "" && userlang != "en") {
        let langobject: any[] = JSON.parse(window.sessionStorage.getItem("language_json"));
        let langitem: any[] = langobject.find(x => x["key"] == value);
        if (langitem == null) {
          langitem = langobject.find(x => x["key"] == value.toLowerCase());
        }
        if (langitem != null) {
          return langitem[0]["value"];
        }
      }

    } catch (e) { }
    return value;
  }
}
