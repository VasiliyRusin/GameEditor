import Vue from "vue";
import Vuex from "vuex";
import global from "@/Global"
import flowchart from "@/components/flowchart/vuex/Flowchart"

Vue.use(Vuex);

export default new Vuex.Store({
    // plugins: [ PersistedState() ],
    modules: {
        global,
        flowchart
    }
});
