export default {
    computed: {
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

        removable: function () {
            return (this.node.removable == null) ? true : this.node.removable;
        },

        points: {
            get: function () {
                return this.node.points || [];
            },

            set: function (value) {
                this.node = {points: value};
            }
        }
    }
}