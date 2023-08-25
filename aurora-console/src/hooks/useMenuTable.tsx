import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invokeApi } from '../utils/http';
import type { ServerMenuItem } from '../hooks/useMenu';

export type DataType = {
  key: string;
  menuName: string;
  icon: React.ReactNode;
  orderNumber: number;
  path: string;
  isHidden: React.ReactNode;
  createTime: string;
  children?: DataType[];
};

type ToggleHidePayload = {
  id: string;
  isHide: boolean;
  topIndex: number | null;
  index: number | null;
};

function useMenuTable(searchText: string) {
  const queryClient = useQueryClient();
  const { isLoading, data: menus } = useQuery<ServerMenuItem[]>(
    ['menus-table', searchText],
    {
      queryFn: () => invokeApi(`/menu?menuName=${searchText}`),
    }
  );

  const toggleHideMutation = useMutation({
    mutationFn: (payload: ToggleHidePayload) =>
      invokeApi(`/menu/${payload.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isHide: payload.isHide }),
      }),
    onMutate: async (payload: ToggleHidePayload) => {
      await queryClient.cancelQueries({
        queryKey: ['menus-table', searchText],
      });
      const previousData = queryClient.getQueryData<ServerMenuItem[]>([
        'menus-table',
        searchText,
      ]);

      let newData;
      if (previousData) {
        if (payload.index === null) {
          // 顶层
          newData = previousData.map((item, index) => {
            if (index === payload.topIndex) {
              if (payload.isHide) {
                // hide all children
                return {
                  ...item,
                  isHidden: payload.isHide,
                  children: item.children?.map((child) => ({
                    ...child,
                    isHidden: payload.isHide,
                  })),
                };
              } else {
                return { ...item, isHidden: payload.isHide };
              }
            }
            return item;
          });
        } else {
          // 子菜单
          newData = previousData.map((item, index) => {
            if (index === payload.topIndex) {
              return {
                ...item,
                children: item.children?.map((child, childIndex) => {
                  if (childIndex === payload.index) {
                    return { ...child, isHidden: payload.isHide };
                  }
                  return child;
                }),
              };
            }
            return item;
          });
        }

        queryClient.setQueryData<ServerMenuItem[]>(
          ['menus-table', searchText],
          newData
        );
      }

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData<ServerMenuItem[]>(
          ['menus-table', searchText],
          context.previousData
        );
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['menus-table', searchText] });
    },
  });

  return {
    isLoading,
    menus,
    toggleHideMutation,
  };
}

export default useMenuTable;
