import { useQuery } from "@tanstack/react-query";
import type { Category, Prompt } from "../backend.d";
import { useActor } from "./useActor";

export function useGetCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCategories();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetCategoryById(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Category>({
    queryKey: ["category", id],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getCategoryById(id);
    },
    enabled: !!actor && !isFetching && !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetPromptsByCategory(categoryId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Prompt[]>({
    queryKey: ["prompts", categoryId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPromptsByCategory(categoryId);
    },
    enabled: !!actor && !isFetching && !!categoryId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSearchPrompts(query: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Prompt[]>({
    queryKey: ["search", query],
    queryFn: async () => {
      if (!actor || !query.trim()) return [];
      return actor.searchPrompts(query.trim());
    },
    enabled: !!actor && !isFetching && query.trim().length > 1,
    staleTime: 1000 * 30,
  });
}
