import React from 'react'
import ListsTab from './ListsTab'
import { fetchCurrentUserLikeIds, getLikedMembers } from '../actions/likeActions'

export const dynamic = 'force-dynamic';

export default async function ListsPage({ searchParams }: { searchParams: { type: string } }) {
  const likeIds = await fetchCurrentUserLikeIds();
  const members = await getLikedMembers(searchParams.type);

  return (
    <div>
      <ListsTab members={members!} likeIds={likeIds} />
    </div>
  )
}