import { handleRequest, ApiRequestParams } from '../API';
import { Search } from '../interfaces/search';

type SearchPaths = {
  query: string | string[];
  depth: number;
};

type SearchArgs = {
  path?: string;
  sortOn?: string | string[];
  sortOrder?: 'ascending' | 'descending' | 'reverse';
  searchableText?: string;
  searchPaths?: SearchPaths;
  metaDataFields?: string | string[];
  fullobjects?: boolean;
  useSiteSearchSettings?: boolean;
  batchSize?: number;
  batchStart?: number;
};

export const getSearch = async ({
  path,
  sortOn,
  sortOrder,
  searchableText,
  searchPaths,
  metaDataFields,
  fullobjects,
  useSiteSearchSettings,
  batchSize,
  batchStart,
}: SearchArgs): Promise<Search> => {
  const options: ApiRequestParams = {
    params: {
      ...(sortOn && { sort_on: sortOn }),
      ...(sortOrder && { sort_order: sortOrder }),
      ...(searchableText && { SearchableText: searchableText }),
      ...(searchPaths && {
        'path.query': searchPaths.query,
        'path.depth': searchPaths.depth,
      }),
      ...(metaDataFields && { metadata_fields: metaDataFields }),
      ...(fullobjects && { fullobjects }),
      ...(useSiteSearchSettings && {
        use_site_search_settings: useSiteSearchSettings,
      }),
      ...(batchSize && { b_size: batchSize }),
      ...(batchStart && { b_start: batchStart }),
    },
  };

  if (!path || path === '/') return handleRequest('get', '/@search', options);

  return handleRequest('get', `${path}/@search`, options);
};

export const getSearchQuery = ({
  path,
  sortOn,
  sortOrder,
  searchableText,
  searchPaths,
  metaDataFields,
  fullobjects,
  useSiteSearchSettings,
  batchSize,
  batchStart,
}: SearchArgs) => ({
  queryKey: [
    path,
    'search',
    sortOn,
    sortOrder,
    searchableText,
    searchPaths,
    metaDataFields,
    fullobjects,
    useSiteSearchSettings,
    batchSize,
    batchStart,
  ],
  queryFn: async () =>
    getSearch({
      path,
      sortOn,
      sortOrder,
      searchableText,
      searchPaths,
      metaDataFields,
      fullobjects,
      useSiteSearchSettings,
      batchSize,
      batchStart,
    }),
});
