import _ from 'lodash';

class q {
  constructor() {
    this.es6 = 'Hello world! ES6';
    this.test = t => console.log(t);
  }
}

export function bootstrap() {
  // bootstrap code here.
  let t = new q();
  console.log(t.es6);
  t.test("Hello my first ES6 APP!");

	let s = new Set();
	s.add(1);
	s.add(2);
	s.add(3);
	s.add(4);

	let a = Array.from(s); // = [ 1, 2, 3, 4 ]

	let b = [...s];     // = [ 1, 2, 3, 4 ]
	
	t.test('Array result: '+b.toString());
	t.test("Hello my first ES6 APP! -- 2");
}

bootstrap();

