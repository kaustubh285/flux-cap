import Fuse from "fuse.js"
import type { FluxConfig } from "../types"

export function createFuseInstance(data: any[], config: FluxConfig) {
	return new Fuse(data, {
		keys: config.search.searchFields,
		includeScore: config.search.fuseOptions?.includeScore || true,
		threshold: config.search.fuseOptions?.threshold || 0.3,
	})
}
