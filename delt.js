var Delt = {
  renderIntoCtx: function(component, ctx) {
    var c = ctx.canvas;
    component({ctx: ctx, rect: [0, 0, c.width, c.height]});
  },
  createComponent: function(options) {
    return function(props, children) {
      // Clone props so we can add items safely.
      var componentProps = Object.create(props);
      componentProps.children = children;

      // Provide a useful context for the methods.
      var thisArg = {
        props: componentProps,
        update: function() {draw(context);}
      };

      // Extend thisArg with compoennt methods.
      for (var name in options) {thisArg[name] = options[name];}

      function draw(context) {
        // Draw the component before the children.
        options.draw && options.draw.call(thisArg, context);

        // Get the child context from modifier methods.
        var childContext = context;
        if (options.getChildRect) {
          childContext = {
            rect: options.getChildRect.call(thisArg, context),
            ctx: context.ctx
          };
        }

        // Draw the children.
        if (options.render) {
          // Combine into an array.
          var componentChildren = [].concat(options.render.call(thisArg));
          componentChildren.forEach(function(child) {
            child && child(childContext);
          });
        }
      }

      // Set initial state.
      if (options.getInitialState) {
        thisArg.state = options.getInitialState.call(thisArg);
      }

      return draw;
    };
  }
};

module.exports = Delt;
