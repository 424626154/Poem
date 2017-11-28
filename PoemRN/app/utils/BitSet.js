'use strict';
/**
 * BitSet
 * @flow
 */
function BitSet(lon:number){
    this.lon = lon||0;
    this.bit_len = 16;
    this.binarys = new Array(this.bit_len);
}
BitSet.prototype.init = function(){
     let temp_binary_str = this.lon.toString(2);
     let temp_binary = temp_binary_str.split("");
     for(var i = 0 ; i < this.binarys.length;i++){
       this.binarys[i] = 0;
     }
     for(var i = 0 ; i < temp_binary.length;i++){
       let index = this.binarys.length - temp_binary.length+i
       if(index >= 0 && index < this.binarys.length)
       this.binarys[index] = parseInt(temp_binary[i]);
     }
    console.log(this.binarys);
}
BitSet.prototype.setBit = function(index,bool){
  // console.log('--- BitSet setBit')
    if(index >= 0 && index < this.bit_len){
      this.binarys[index] = bool?1:0;
      console.log('this.binarys[index]:',this.binarys[index])
      let temp_binary_str = '';
      for(var i = 0 ; i < this.binarys.length;i++){
        temp_binary_str += this.binarys[i];
      }
      this.lon = parseInt(temp_binary_str,2);
    }
}
BitSet.prototype.getBit = function(index){
  if(index >= 0 && index < this.bit_len){
    return this.binarys[index] == 0 ?false:true;
  }else{
    return false;
  }
}
BitSet.prototype.info = function(){
    console.log(this.lon)
    console.log(this.binarys)
}
BitSet.prototype.getLon = function(){
    return this.lon;
}
export default BitSet;
