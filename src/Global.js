import Vue from "vue";

let templates = {
    string: {
        name: null,
        type: 'string',
        value: ''
    },

    number: {
        name: null,
        type: 'number',
        value: 0
    },

    boolean: {
        name: null,
        type: 'boolean',
        value: false
    }
};

export default {
    namespaced: true,
    state: {
        variables: []
    },
    actions: {},
    mutations: {
        ADD_VARIABLE: function (state, variable) {
            state.variables.push(Object.assign({}, templates[variable.type], variable, {
                type: templates[variable.type].type
            }))
        },

        UPDATE_VARIABLE: function (state, {index, variable}) {
            Vue.set(state.variables, index, Object.assign(state.variables[index], variable));
        },

        REMOVE_VARIABLE: function (state, index) {
            state.variables.splice(index, 1);
        }
    },
    getters: {
        variables: function (state) {
            return state.variables;
        }
    }
}