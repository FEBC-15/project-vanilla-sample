import type { PostListItem } from "../../types/post";
import type { PostListRes } from "../../types/response";
import { getAxios } from "../../utils/axios";

async function getData(){
  const axios = getAxios();
  try{
    const { data } = await axios.get<PostListRes>('/posts?type=brunch');
    console.log(data);
    return data;
  }catch(err){
    console.log(err);
  }
  
}

function render(posts: PostListItem[]){
  const result = posts.map(post => {
    return `
      <tr class="border-b border-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300 ease-in-out">
        <td class="p-2 text-center">${post._id}</td>
        <td class="p-2 truncate indent-4"><a href="/src/pages/board/detail?id=2&type=info" class="hover:text-orange-500 hover:underline">${post.title}</a></td>
        <td class="p-2 text-center truncate">${post.user?.name}</td>
        <td class="p-2 text-center hidden sm:table-cell">${post.repliesCount}</td>
        <td class="p-2 truncate text-center hidden sm:table-cell">${post.createdAt}</td>
      </tr>
    `;
  });
  const tbody = document.querySelector('tbody');
  if(tbody){
    tbody.innerHTML = result.join('');
  }
}

const data = await getData();
if(data?.ok){
  render(data.item);
}
