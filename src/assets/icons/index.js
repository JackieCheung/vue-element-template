import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon' // svg icon component

// register globally
Vue.component('svg-icon', SvgIcon)

const ctx = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(ctx)
