import { Injectable } from '@angular/core';

/*
interface BrkPnt {
  isSmScreen : boolean;
  isSmScrPrt: boolean;
  isMidScreen: boolean;
  isWideScreen: boolean;
}
*/

@Injectable()
export class GlobalVariables {
  //appBrkPnt: BrkPnt;
  bp_isSmScreen : boolean;
  bp_isSmScrPrt: boolean;
  bp_isMidScreen: boolean;
  bp_isWideScreen: boolean;
}
