import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date'
})
export class DatePipe implements PipeTransform {

  transform(value): string {
    let date = new Date(value * 1000);

    let hoy = new Date();
    let tiempoPasado= hoy - date
    let segs = 1000;
    let mins = segs * 60;
    let hours = mins * 60;
    let days = hours * 24;
    let months = days * 30.416666666666668;
    let years = months * 12;

    //calculo
    let anos = Math.floor(tiempoPasado / years);

    tiempoPasado = tiempoPasado - (anos * years);
    let meses = Math.floor(tiempoPasado / months);

    tiempoPasado = tiempoPasado - (meses * months);
    let dias = Math.floor(tiempoPasado / days);

    tiempoPasado = tiempoPasado - (dias * days);
    let horas = Math.floor(tiempoPasado / hours);

    tiempoPasado = tiempoPasado - (horas * hours);
    let minutos = Math.floor(tiempoPasado / mins);

    tiempoPasado = tiempoPasado - (minutos * mins);
    let segundos = Math.floor(tiempoPasado / segs);

    let result = 'Hace ';
    if(anos > 0){
      let m = anos + " años, ";
      result = result.concat(m);
    }

    if(meses > 0){
      let m = meses + " meses, ";
      result = result.concat(m);
    }

    if(dias > 0){
      let m = dias + " días, ";
      result = result.concat(m);
    }

    if(horas > 0){
      let m = horas + " horas, ";
      result = result.concat(m);
    }

    if(minutos > 0){
      let m = minutos + " minutos";
      result = result.concat(m);
    }

    return result;
  }

}
