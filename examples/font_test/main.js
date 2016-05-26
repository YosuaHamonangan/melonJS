
var game = {

    /**
     * Initialize the application
     */
     onload: function() {

        // Initialize the video.
        if (!me.video.init(640, 700, {wrapper : "screen", scale : "auto"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // set all ressources to be loaded
        me.loader.preload([{
            name: "xolo12", type:"image", src: "xolo12.png"
        }, {
            name: "xolo12", type:"binary", src: "xolo12.fnt"
        }, {
            name: "arialfancy", type:"image", src: "arialfancy.png"
        }, {
            name: "arialfancy", type:"binary", src: "arialfancy.fnt"
        }],
        this.loaded.bind(this));
    },

    /**
     * callback when everything is loaded
     */
    loaded: function () {
        var PlayScreen = me.ScreenObject.extend({
            // on reset event function
            onResetEvent : function() {
                // black background
                me.game.world.addChild(new me.ColorLayer("background", "#202020"), 0);
                // the font stuff
                me.game.world.addChild(new FontTest(), 1);
            }
        });

        // set the "Play/Ingame" Screen Object
        me.state.set(me.state.PLAY, new PlayScreen());
        // switch to PLAY state
        me.state.change(me.state.PLAY);
    }

}; // game


// the font test renderables object
var FontTest = me.Renderable.extend ({

    // constructor
    init: function() {
        this._super(me.Renderable, "init", [0, 0, me.video.renderer.getWidth(), me.video.renderer.getHeight()]);

        // a default white color object
        this.color = me.pool.pull("me.Color", 255, 255, 255);

        // define a tween to cycle the font color
        this.tween = new me.Tween(this.color)
            .to({
                g : 0,
                b : 0
            }, 2000)
            .repeat( Infinity )
            .yoyo(true)
            .start();

        // arial font
        this.font = new me.Font("Arial", 8, this.color);
        // bitmap font
        this.bFont = new me.BitmapFont(new me.BitmapFontData(me.loader.getBinary('xolo12')), me.loader.getImage('xolo12'));
        this.bFont.name = 'xolo';
        this.name = "FontTest";

        this.fancyBFont = new me.BitmapFont(new me.BitmapFontData(me.loader.getBinary('arialfancy')), me.loader.getImage('arialfancy'));
        this.fancyBFont.name = 'arial';
    },

    // draw function
    draw : function(renderer) {
        var i = 0;
        var text = "";
        var baseline = 0;
        var xPos = 0;
        var yPos = 0;

        // font size test
        this.font.textAlign = "left";
        this.font.lineWidth = "2";
        this.font.setOpacity (0.5);
        for (i = 8; i < 48; i += 8) {
            this.font.setFont("Arial", i, this.color);
            this.font.draw(renderer, "Arial Text " + i + "px !" , 5 , yPos );
            yPos += this.font.measureText(renderer, "DUMMY").height;
        }
        // one more with drawStroke this time
        this.font.setFont("Arial", 48, this.color);
        this.font.strokeStyle.parseCSS("red");
        this.font.lineWidth = 3;
        this.font.drawStroke(renderer, "Arial Text " + i + "px !" , 5 , yPos );

        // bFont size test
        yPos = 0;
        this.bFont.textAlign = "right";
        for (i = 1; i < 5; i++) {
            this.bFont.setOpacity (0.2 * i);
            this.bFont.resize(i);
            this.bFont.draw(renderer, "BITMAP TEST", me.video.renderer.getWidth(), yPos );
            yPos += this.bFont.measureText("DUMMY").height;
        }

        this.font.setOpacity(1);
        this.bFont.setOpacity(1);

        // font baseline test
        this.font.setFont("Arial", 16, "white");
        baseline = 200;

        // Draw the baseline
        me.video.renderer.setColor("red");
        me.video.renderer.strokeLine(
            0, baseline + 0.5,
            me.video.renderer.getWidth(), baseline + 0.5
        );

        var baselines = [
            "bottom", "ideographic", "alphabetic", "middle", "hanging", "top"
        ];

        // font baseline test
        me.video.renderer.setColor("white");
        for (i = 0; i < baselines.length; i++) {
            text = baselines[i];
            this.font.textBaseline = baselines[i];
            this.font.draw(renderer, text, xPos, baseline);
            xPos += this.font.measureText(renderer, text + "@@@").width;
        }

        // restore default baseline
        this.font.textBaseline = "top";

        // ---- multiline testing -----

        // font text
        text = "this is a multiline font\n test with melonjs and it\nworks even with a\n specific lineHeight value!";
        this.font.textAlign = "center";
        this.font.lineHeight = 1.1;
        this.font.draw(renderer, text, 90, 210);
        this.font.lineHeight = 1.1;

        text = "this is another font test \nwith right alignment\nand it still works!";
        this.font.textAlign = "right";
        this.font.draw(renderer, text, 200, 300);

        this.drawBitmapFont(renderer, this.bFont, 0, baselines, 1.0);
        this.drawBitmapFont(renderer, this.fancyBFont, 300, baselines, 1.2);

        // restore default alignement/baseline
        this.font.textAlign = "left";
        this.font.textBaseline = "top";
        this.bFont.textAlign = "left";
        this.bFont.textBaseline = "top";
        this.fancyBFont.textAlign = "left";
        this.fancyBFont.textBaseline = "top";
    },

    drawBitmapFont: function (renderer, font, yOffset, baselines, scale) {
        // bFont  test
        font.textAlign = "center";
        var text = "THIS IS A MULTILINE\n BITMAP FONT WITH MELONJS\nAND IT WORKS";
        font.resize(scale);
        font.draw(renderer, text + "\n" + text, 400, 230 + yOffset);

        // bFont  test
        font.textAlign = "right";
        text = "ANOTHER FANCY MULTILINE\n BITMAP FONT WITH MELONJS\nAND IT STILL WORKS";
        font.lineHeight = 1.2;
        font.draw(renderer, text, 640, 400 + yOffset);
        font.lineHeight = 1.0;

        // baseline test with bitmap font
        var xPos = 0;
        font.textAlign = "left";
        var baseline = 375 + yOffset;

        // Draw the baseline
        me.video.renderer.setColor("red");
        me.video.renderer.strokeLine(
            0, baseline + 0.5,
            me.video.renderer.getWidth(), baseline + 0.5
        );

        // font baseline test
        me.video.renderer.setColor("white");
        for (var i = 0; i < baselines.length; i++) {
            text = baselines[i];
            font.textBaseline = baselines[i];
            font.draw(renderer, text, xPos, baseline);
            xPos += font.measureText(text + "@@@").width;
        }
    },

    onDeactivateEvent: function() {
        me.pool.push(this.color);
    }
});
