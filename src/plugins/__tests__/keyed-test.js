global.Symbol = () => ({})
const dd = require('../../dotdom');
const p = require('../keyed')


describe('#P.Keyed', function () {

  describe('Standalone', function () {

    it('should not do anything on empty list', function () {
      const components = [ ];
      const state = { };

      let ret = p.K(state, components);
      expect(ret).toEqual([]);
    });

    it('should populate empty state object at creation time', function () {
      const components = [];
      const state = { };

      function Stateful(props, state, setState) {
        return dd.H('div');
      }

      components.push(dd.H(Stateful, { key: 'foo' }));
      components.push(dd.H(Stateful, { key: 'bar' }));

      let ret = p.K(state, components, "K");
      expect(ret.length).toEqual(2);
      expect(ret[0]).toBe(components[0])
      expect(ret[1]).toBe(components[1])
      expect(state["K"]).toEqual({
        foo: components[0].s,
        bar: components[1].s
      })
      expect(state["K"].foo).toEqual({});
      expect(state["K"].bar).toEqual({});
    });

    it('should remove state if object is removed', function () {
      const components = [];
      const state = { };

      function Stateful(props, state, setState) {
        return dd.H('div');
      }

      components.push(dd.H(Stateful, { key: 'foo' }));
      components.push(dd.H(Stateful, { key: 'bar' }));

      let ret = p.K(state, components, "K");
      expect(ret.length).toEqual(2);
      expect(ret[0]).toBe(components[0])
      expect(ret[1]).toBe(components[1])
      expect(state["K"]).toEqual({
        foo: components[0].s,
        bar: components[1].s
      })
      expect(state["K"].foo).toEqual({});
      expect(state["K"].bar).toEqual({});

      components.shift(); // Remove 'foo'

      ret = p.K(state, components, "K");
      expect(ret.length).toEqual(1);
      expect(ret[0]).toBe(components[0])
      expect(state["K"]).toEqual({
        bar: components[0].s
      })
      expect(state["K"].bar).toEqual({});
    });

    it('should replace objects with new ones, while keeping same-key state', function () {
      const components = [];
      const state = { };

      function Stateful(props, state, setState) {
        return dd.H('div');
      }

      components.push(dd.H(Stateful, { key: 'foo' }));
      components.push(dd.H(Stateful, { key: 'bar' }));

      let ret = p.K(state, components, "K");
      expect(ret.length).toEqual(2);
      expect(ret[0]).toBe(components[0])
      expect(ret[1]).toBe(components[1])
      expect(state["K"]).toEqual({
        foo: components[0].s,
        bar: components[1].s
      })
      expect(state["K"].foo).toEqual({});
      expect(state["K"].bar).toEqual({});

      // Change properties, but keep the same key
      const newFoo = dd.H(Stateful, { key: 'foo', nth: 2 });
      const oldFoo = components.shift();
      components.unshift(newFoo);

      ret = p.K(state, components, "K");
      expect(ret.length).toEqual(2);
      expect(ret[0]).toBe(components[0])
      expect(ret[1]).toBe(components[1])
      expect(state["K"]).toEqual({
        foo: components[0].s,
        bar: components[1].s
      })
      expect(state["K"].foo).toEqual({});
      expect(state["K"].bar).toEqual({});

      // Ensure state object is preserved
      expect(oldFoo.s).toBe(newFoo.s);
    });

  });

});
