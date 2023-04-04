import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper, testServer } from '../testUtils';
import { getSearchQuery } from './get';
import { useQuery } from '@tanstack/react-query';

describe('[GET] Search', () => {
  test('Hook - Successful', async () => {
    const path = '/';
    const { result } = renderHook(() => useQuery(getSearchQuery({ path })), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // @ts-ignore
    expect(result.current?.data?.items[4]?.title).toBe('Welcome to Plone 6!');
    expect(result.current?.data?.items_total).toBe(5);
  });

  test('Hook - Failure', async () => {
    const path = '/blah';
    const { result } = renderHook(() => useQuery(getSearchQuery({ path })), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    // @ts-ignore
    expect(result.current.error.status).toBe(404);
    expect(result.current.error).toBeDefined();
  });

  test('Hook - sortOn', async () => {
    const sortOn = 'path';

    const { result } = renderHook(() => useQuery(getSearchQuery({ sortOn })), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // @ts-ignore
    expect(result.current?.data?.items[0]?.title).toBe('Welcome to Plone 6!');
    expect(result.current?.data?.items_total).toBe(5);
  });

  test('Hook - sortOn && sortOrder', async () => {
    const sortOn = 'path';
    const sortOrder = 'descending';

    const { result } = renderHook(
      () =>
        useQuery(
          getSearchQuery({
            sortOn,
            sortOrder,
          }),
        ),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // @ts-ignore
    expect(result.current?.data?.items[0]?.title).toBe('News');
    expect(result.current?.data?.items_total).toBe(5);
  });

  test('Hook - searchableText', async () => {
    const path = '/';
    const searchableText = 'Welcome to Plone 6';
    const { result } = renderHook(
      () => useQuery(getSearchQuery({ path, searchableText })),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // @ts-ignore
    expect(result.current?.data?.items[0]?.title).toBe('Welcome to Plone 6!');
    expect(result.current?.data?.items_total).toBe(1);
  });

  test('Hook - searchPaths', async () => {
    const searchPaths = { query: ['/plone/news', '/plone/events'], depth: 2 };
    const { result } = renderHook(
      () => useQuery(getSearchQuery({ searchPaths })),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // @ts-ignore
    expect(result.current?.data?.items[0]?.description).toBe('Site News');
    expect(result.current?.data?.items[3]?.title).toBe('Events');
    expect(result.current?.data?.items_total).toBe(4);
  });

  test('Hook - searchableText && searchPaths', async () => {
    const searchPaths = { query: ['/plone/news', '/plone/events'], depth: 2 };
    const searchableText = 'news';

    const { result } = renderHook(
      () => useQuery(getSearchQuery({ searchPaths, searchableText })),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // @ts-ignore
    expect(result.current?.data?.items[0]?.description).toBe('Site News');
    expect(result.current?.data?.items[1]?.title).toBe('News');
    expect(result.current?.data?.items_total).toBe(2);
  });

  test('Hook - metaDataFields', async () => {
    const metaDataFields = ['modified', 'created'];
    const { result } = renderHook(
      () => useQuery(getSearchQuery({ metaDataFields })),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // @ts-ignore
    expectTypeOf(result.current?.data?.items[0]?.modified).toBeString();
    // @ts-ignore
    expectTypeOf(result.current?.data?.items[0]?.created).toBeString();
    expect(result.current?.data?.items_total).toBe(5);
  });

  test('Hook - metaDataFields _all', async () => {
    const path = '/';
    const metaDataFields = '_all';
    const { result } = renderHook(
      () => useQuery(getSearchQuery({ path, metaDataFields })),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // @ts-ignore
    expectTypeOf(result.current?.data?.items[0]?.modified).toBeString();
    // @ts-ignore
    expectTypeOf(result.current?.data?.items[0]?.created).toBeString();
    // @ts-ignore
    expectTypeOf(result.current?.data?.items[0]?.UID).toBeString();
    expect(result.current?.data?.items_total).toBe(5);
  });

  test('Hook - fullobjects && searchableText', async () => {
    const fullobjects = true;
    const searchableText = 'site';
    const { result } = renderHook(
      () => useQuery(getSearchQuery({ fullobjects, searchableText })),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // @ts-ignore
    expectTypeOf(result.current?.data?.items[0]['@components']).toBeObject();
    expect(result.current?.data?.items[0]?.title).toBe('Events');
    expect(result.current?.data?.items_total).toBe(4);
  });

  test('Hook - useSiteSearchSettings', async () => {
    const useSiteSearchSettings = true;
    const { result } = renderHook(
      () => useQuery(getSearchQuery({ useSiteSearchSettings })),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // @ts-ignore
    expect(result.current?.data?.items[3]?.title).toBe('Events');
    expect(result.current?.data?.items_total).toBe(4);
  });

  test('Hook - batching', async () => {
    const batchSize = 2;
    const batchStart = 2;
    const { result } = renderHook(
      () => useQuery(getSearchQuery({ batchSize, batchStart })),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // @ts-ignore
    expect(result.current?.data?.items[0]?.title).toBe('Events');
    // @ts-ignore
    expect(result.current?.data?.batching['@id']).toBe(
      'http://localhost:55001/plone/++api++/@search?b_size=2&b_start=2',
    );
    expect(result.current?.data?.items.length).toBe(2);
    expect(result.current?.data?.items_total).toBe(5);
  });
});
