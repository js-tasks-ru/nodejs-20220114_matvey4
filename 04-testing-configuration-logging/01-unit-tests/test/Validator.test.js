const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    const validator = new Validator({
      name: {
        type: 'string',
        min: 10,
        max: 20,
      },
      age: {
        type: 'number',
        min: 18,
        max: 27,
      }
    });

    it('валидатор проверяет строковые поля (<min)', () => {

      const errors = validator.validate({ name: 'Lalala', age: 18 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });

    it('валидатор проверяет строковые поля (>max)', () => {

      const errors = validator.validate({ name: 'LalalaLalalaLalalaLalala', age: 19  });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 24');
    });

    it('валидатор проверяет строковые поля (ok)', () => {

      const errors = validator.validate({ name: 'LalalaLalalaLalala', age: 19  });

      expect(errors).to.have.length(0);
    });

    it('валидатор проверяет числовые поля (<min)', () => {

      const errors = validator.validate({name: 'LalalaLalalaLalala', age: 17 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 18, got 17');
    });

    it('валидатор проверяет числовые поля (>max)', () => {

      const errors = validator.validate({ name: 'LalalaLalalaLalala',age:28});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 27, got 28');
    });

    it('валидатор проверяет числовые поля (ok)', () => {

      const errors = validator.validate({name: 'LalalaLalalaLalala',age: 19});

      expect(errors).to.have.length(0);
    });

    it('Валидатор выдает ошибку при несоответствии типов', () => {

      const errors = validator.validate({name: 'LalalaLalalaLalala', age: 'AAA'});

      expect(errors).to.have.length(1);

      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
    });
  });
});