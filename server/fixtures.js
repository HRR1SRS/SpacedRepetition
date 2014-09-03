if (Cards.find().count() === 0 ) {
  Cards.insert ({
    q: 'What is 1 + 1',
    a: 2,
    topic: 'math'
  });

  Cards.insert ({
    q: 'What is 2 + 2',
    a: 4,
    topic: 'math'
  });

  Cards.insert ({
    q: 'What is 3 + 3',
    a: 6,
    topic: 'math'
  });

  Cards.insert ({
    q: 'What is 4 + 4',
    a: 8,
    topic: 'math'
  });

  Cards.insert ({
    q: 'What is 5 + 5',
    a: 10,
    topic: 'math'
  });

  Cards.insert ({
    q: 'What is a + a',
    a: 'aa',
    topic: 'reading'
  });

  Cards.insert ({
    q: 'What is b + b',
    a: 'bb',
    topic: 'reading'
  });

  Cards.insert ({
    q: 'What is c + c',
    a: 'cc',
    topic: 'reading'
  });

  Cards.insert ({
    q: 'What is d + d',
    a: 'dd',
    topic: 'reading'
  });

  Cards.insert ({
    q: 'What is e + e',
    a: 'ee',
    topic: 'reading'
  });
}