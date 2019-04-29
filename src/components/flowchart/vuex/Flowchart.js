import Vue from "vue";

let templates = {
    Start: {
        type: 'Start',
        name: 'Начало',
        x: 0,
        y: 0,
        w: 300,
        h: 150,
        editable: false,
        removable: false,
        points: [
            {
                one: true,
                offsetX: 0,
                offsetY: 0,
                type: 'out',
                label: 'Старт'
            }
        ]
    },
    Scene: {
        type: 'Scene',
        name: 'Сцена',
        x: 0,
        y: 0,
        w: 300,
        h: 150,
        editable: true,
        removable: true,
        points: [
            {
                one: true,
                offsetX: 0,
                offsetY: 0,
                type: 'in',
                label: 'Вход'
            },
            {
                one: true,
                offsetX: 0,
                offsetY: 0,
                type: 'out',
                label: 'Выход'
            }
        ]
    },
    End: {
        type: 'End',
        name: 'Конец',
        x: 0,
        y: 0,
        w: 300,
        h: 150,
        editable: false,
        removable: true,
        points: [
            {
                one: true,
                offsetX: 0,
                offsetY: 0,
                type: 'in',
                label: 'Конец'
            }
        ]
    }
};

export default {
    namespaced: true,
    state: {
        scale: 1,
        active: null,
        nodes: [
            JSON.parse(JSON.stringify(templates.Start))
        ],
        links: [
            // {
            //     startNode: 0,
            //     startPoint: 0,
            //     endNode: 1,
            //     endPoint: 0,
            //     points: {
            //         x1: 290,
            //         y1: 70,
            //         x2: 460,
            //         y2: 270
            //     }
            // }
        ]
    },
    actions: {
        add_node: function ({state, commit}, node) {
            let x = node.x || 0,
                y = node.y || 0;

            for (let item of state.nodes) {
                if (item.x === x || item.y === y) y = x = (x += 20);
            }

            node = Object.assign(node, templates[node.type], {x, y});

            commit('ADD_NODE', node);
        },

        update_active_node: function ({state, commit}, node) {
            if (node != null) {
                commit('UPDATE_NODE', {
                    index: state.active,
                    node: node
                })
            }
        },

        remove_node: function ({state, commit, dispatch}, index) {
            if (state.active === index) commit('UPDATE_ACTIVE', null);
            dispatch('remove_links_from_node', index);
            dispatch('update_links', index);

            commit('REMOVE_NODE', index)
        },

        remove_links_from_node: function ({state, commit, dispatch}, index) {
            for (let i in state.links) {
                if (state.links.hasOwnProperty(i)) {
                    let link = state.links[i];
                    if (link.startNode === index || link.endNode === index) {
                        commit('REMOVE_LINK', i);

                        return dispatch('remove_links_from_node', index);
                    }
                }
            }
        },

        update_links: function ({state, commit}, index) {
            for (let i in state.links) {
                if (state.links.hasOwnProperty(i)) {
                    let link = state.links[i];

                    if (link.startNode >= index || link.endNode >= index) {
                        commit('UPDATE_LINK', {
                            index: i,
                            link: {
                                startNode: link.startNode - 1,
                                endNode: link.endNode - 1
                            }
                        });
                    }
                }
            }
        },
    },
    mutations: {
        ADD_NODE: function (state, node) {
            state.nodes.push(node);
        },

        UPDATE_NODE: function (state, {index, node}) {
            Vue.set(state.nodes, index, Object.assign(state.nodes[index], node));
        },

        REMOVE_NODE: function (state, index) {
            state.nodes.splice(index, 1);
        },

        ADD_LINK: function (state, link) {
            state.links.push(link);
        },

        UPDATE_LINK: function (state, {index, link}) {
            Vue.set(state.links, index, Object.assign(state.links[index], link));
        },

        REMOVE_LINK: function (state, index) {
            state.links.splice(index, 1);
        },

        UPDATE_SCALE: function (state, value) {
            state.scale = value;
        },

        UPDATE_ACTIVE: function (state, value) {
            state.active = value;
        },
    },
    getters: {
        nodes: function (state) {
            return state.nodes;
        },

        links: function (state) {
            return state.links;
        },

        active: function (state) {
            return state.active;
        },

        activeNode: function (state) {
            return state.nodes[state.active];
        },

        scale: function (state) {
            return state.scale;
        }
    }
}