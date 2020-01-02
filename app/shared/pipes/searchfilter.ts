import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchfilter'
})

@Injectable()
export class SearchFilterPipe implements PipeTransform {
  transform(items: any[], field: string, searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    var filteredItems = items.filter(it => it[field].toLowerCase().indexOf(searchText.toLowerCase()) > -1);
    return filteredItems;
  }
}
