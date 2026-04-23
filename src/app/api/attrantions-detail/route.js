export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const contentid = searchParams.get(['contentid']);
  const contenttypeid = searchParams.get(['contenttypeid']);
  const apiKey = process.env.KOREA_ATTRANTIONS_API_KEY;

  

  const res = await fetch(
    `https://apis.data.go.kr/B551011/KorService2/detailIntro2?MobileOS=etc&MobileApp=test&contentId=${contentid}&contentTypeId=${contenttypeid}&serviceKey=${apiKey}&_type=json`
  );
  const data = await res.json();

  return Response.json(data.response.body.items.item[0]);
}