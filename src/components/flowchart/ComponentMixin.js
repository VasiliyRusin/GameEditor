import debounce from "lodash/debounce";

export default {
    props: {
        index: {
            type: Number,
            required: true
        }
    },

    mounted: function () {
        let offsetX = 0,
            offsetY = 0,
            parentWidth = this.$parent.$el.offsetWidth,
            parentHeight = this.$parent.$el.offsetHeight,
            parentOffsetX = 0,
            parentOffsetY = 0,
            drag = false;

        this.move = debounce(async function () {
            await this.$nextTick();
            this.$emit('move', {
                index: this.index,
                x: this.x,
                y: this.y,
                points: await this.$refs.Points.positions()
            });
        }.bind(this), 0, {leading: true, trailing: true});

        this.mousemove = function (e) {
            if (drag) {
                // this.x = (e.layerX - parentOffsetX) / this.scale - offsetX;
                // this.y = (e.layerY - parentOffsetY) / this.scale - offsetY;

                this.x += e.movementX / this.scale;
                this.y += e.movementY / this.scale;

                this.move();
            }
        }.bind(this);

        this.$el.onmousedown = function (e) {
            if (e.button === 0) {
                drag = true;
                offsetX = e.offsetX;
                offsetY = e.offsetY;
                parentOffsetX = (parentWidth - parentWidth * this.scale) / 2;
                parentOffsetY = (parentHeight - parentHeight * this.scale) / 2;
            }
        }.bind(this);

        this.mouseup = function (e) {
            if (e.button === 0 && drag) drag = false;
        }.bind(this);
        this.drop = function () {
            drag = false;
        }.bind(this);

        this.$parent.$el.addEventListener('drop', this.drop);
        this.$parent.$el.addEventListener('mousemove', this.mousemove);
        this.$parent.$el.addEventListener('mouseup', this.mouseup);
    },

    computed: {
        scale: function () {
            return this.$store.getters['flowchart/scale'];
        },

        node: {
            get: function () {
                return this.$store.getters['flowchart/nodes'][this.index];
            },

            set: function (value) {
                this.$store.commit('flowchart/UPDATE_NODE', {
                    index: this.index,
                    node: Object.assign(this.node, value)
                })
            }
        },

        name: {
            get: function () {
                return this.node.name || '';
            },

            set: function (value) {
                this.node = {name: value};
            }
        },

        x: {
            get: function () {
                return this.node.x || 0;
            },

            set: function (value) {
                this.node = {x: value};
            }
        },

        y: {
            get: function () {
                return this.node.y || 0;
            },

            set: function (value) {
                this.node = {y: value};
            }
        },

        w: {
            get: function () {
                return this.node.w || 0;
            },

            set: function (value) {
                this.node = {w: value};
            }
        },

        h: {
            get: function () {
                return this.node.h || 0;
            },

            set: function (value) {
                this.node = {h: value};
            }
        },

        points: {
            get: function () {
                return this.node.points || [];
            },

            set: function (value) {
                this.node = {points: value};
            }
        }
    },

    methods: {
        remove: function () {
            this.$store.dispatch('flowchart/remove_node', this.index);
        }
    },

    beforeDestroy: function () {
        this.$parent.$el.removeEventListener('drop', this.drop);
        this.$parent.$el.removeEventListener('mousemove', this.mousemove);
        this.$parent.$el.removeEventListener('mouseup', this.mouseup);
    }

}