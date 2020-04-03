import React from 'react';

import { I18nProps } from '@polkadot/react-components/types';

import { ViewBlogPage, BlogData, loadBlogData } from './ViewBlog';
import { BlogId } from '@subsocial/types/substrate/interfaces/subsocial';
import ListData from '../utils/DataList';
import { Button } from 'antd';
import { NextPage } from 'next';
import { GenericAccountId as AccountId } from '@polkadot/types';
import { HeadMeta } from '../utils/HeadMeta';
import { getApi } from '../utils/SubstrateApi';
import { registry } from '@polkadot/react-api';
import BN from 'bn.js';

type Props = {
  totalCount: number;
  blogsData: BlogData[];
};

export const ListBlog: NextPage<Props> = (props: Props) => {
  const { totalCount, blogsData } = props;
  return (
    <div className='ui huge relaxed middle aligned divided list ProfilePreviews'>
      <HeadMeta title='All blogs' desc='Subsocial blogs' />
      <ListData
        title={`All blogs (${totalCount})`}
        dataSource={blogsData}
        renderItem={(item, index) =>
          <ViewBlogPage {...props} key={index} blogData={item} previewDetails withFollowButton />}
        noDataDesc='There are no blogs yet'
        noDataExt={<Button href='/blogs/new'>Create blog</Button>}
      />
    </div>
  );
};

ListBlog.getInitialProps = async (): Promise<Props> => {
  const api = await getApi();
  const nextBlogId = await api.query.social.nextBlogId() as BlogId;

  const firstBlogId = new BN(1);
  const totalCount = nextBlogId.sub(firstBlogId).toNumber();
  let blogsData: BlogData[] = [];

  if (totalCount > 0) {
    const firstId = firstBlogId.toNumber();
    const lastId = nextBlogId.toNumber();
    const loadBlogs: Promise<BlogData>[] = [];
    for (let i = firstId; i < lastId; i++) {
      loadBlogs.push(loadBlogData(api, new BN(i)));
    }
    blogsData = await Promise.all<BlogData>(loadBlogs);
  }

  return {
    totalCount,
    blogsData
  };
};

type MyBlogProps = {
  blogsData: BlogData[];
};

export const ListMyBlogs: NextPage<MyBlogProps> = (props: MyBlogProps) => {
  const { blogsData } = props;
  const totalCount = blogsData.length;
  return (<>
    <HeadMeta title='My blogs' desc='Subsocial blogs' />
    <div className='ui huge relaxed middle aligned divided list ProfilePreviews'>
      <ListData
        title={`My Blogs (${totalCount})`}
        dataSource={blogsData}
        renderItem={(item, index) => <ViewBlogPage {...props} key={index} blogData={item} previewDetails withFollowButton />}
        noDataDesc='You do not have your own blogs yet'
        noDataExt={<Button href='/blogs/new'>Create my first blog</Button>}
      />
    </div>
  </>
  );
};

ListMyBlogs.getInitialProps = async (props): Promise<MyBlogProps> => {
  const { query: { address } } = props;
  const api = await getApi();
  const myBlogIds = await api.query.social.blogIdsByOwner(new AccountId(registry, address as string)) as unknown as BlogId[];
  const loadBlogs = myBlogIds.map(id => loadBlogData(api, id));
  const blogsData = await Promise.all<BlogData>(loadBlogs);
  return {
    blogsData
  }
}
