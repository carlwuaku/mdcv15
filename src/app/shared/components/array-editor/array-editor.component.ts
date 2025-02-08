import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-array-editor',
    templateUrl: './array-editor.component.html',
    styleUrls: ['./array-editor.component.scss'],
    standalone: false
})
export class ArrayEditorComponent {
  @Input() objects:any[] = [];
  @Output() valueChanged:EventEmitter<any[]> = new EventEmitter();
  removedItems:any[] = [];
  // tempAddedItems:any[] = [];
  newItem:string = "";
  constructor(){}

  removeItem(h:string){
    this.removedItems.push(h);
    this.emitValue();
  }



  addNew(){
    if (this.newItem.trim()){
      this.objects.push(this.newItem);
      this.newItem = '';
      this.emitValue();
    }
    else{
      alert('Please type something');
    }

  }

  undoRemove(h:string){
    this.removedItems.splice(this.removedItems.indexOf(h), 1);
    this.emitValue();
  }

  moveUp(object:string){
    let index = this.objects.indexOf(object)
    const element = this.objects.splice(index,  1)[0];
    // Insert the element back at the previous index
    this.objects.splice(index -  1,  0, element);
    this.emitValue();
  }

  moveDown(object:string){
    let index = this.objects.indexOf(object)
    const element = this.objects.splice(index,  1)[0];
    // Insert the element back at the next index
    this.objects.splice(index +  1,  0, element);
    this.emitValue();
  }

  emitValue(){
      let filteredValue = this.objects.filter(obj => !this.removedItems.includes(obj));
      this.valueChanged.emit(filteredValue);
  }
}
