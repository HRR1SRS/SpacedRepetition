var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

describe('the SRS library', function(){
  
  
  describe('the srs app function', function(){
    it('should be a function', function(){
      expect(app).to.be.a('function');
    });
    it('should return an object', function(){
      var topic = new Topic();
      expect(topic).to.be.a('object');
    });
  });
  
  
  describe('the Topic function', function(){
    it('should be a function', function(){
      expect(Topic).to.be.a('function');
    });
  });
  

  describe('the Deck function', function(){
    it('should be a function', function(){
      expect(Deck).to.be.a('function');
    });
  });
  

  describe('the Card function', function(){
    it('should be a function', function(){
      expect(Card).to.be.a('function');
    });
  });
  

  describe('the Queue function', function(){
    it('should be a function', function(){
      expect(Queue).to.be.a('function');
    });
  });
  

  describe('the User function', function(){
    it('should be a function', function(){
      expect(User).to.be.a('function');
    });
  });
});