import Vue from "vue";
import Vuex from "vuex";
import flowchart from "@/components/flowchart/vuex/Flowchart"

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        flowchart
    }
});
