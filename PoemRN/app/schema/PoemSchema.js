const PoemSchema = {
  name:'Poem',
  properties:{
    poem:'string',
    author:'string',
    time:{type: 'date', optional: true}
  }
}
