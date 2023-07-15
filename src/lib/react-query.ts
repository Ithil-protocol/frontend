import { MutationCache, QueryClient,QueryCache } from "@tanstack/react-query";

const mutationCache = new MutationCache({
  onError(error, variables, context, mutation) {
    console.log("mutation33",mutation)
  },
})

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 0,
    },
  },
  queryCache:new QueryCache({
     onError(error, query) {
       console.log("query333",query)
     },
     onSuccess(data, query) {
      console.log("data333",data)       
      console.log("query333",query.meta)       
     },
  }),
});
