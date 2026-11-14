import mockJson from "@/mocks/mylink-mock.json";
import {
  LinkCardItem,
  LinkSectionItem,
  MyLinkData,
  MyLinkMockApiResponse,
  MyLinkProfileData,
  SocialBadgeItem,
} from "@/types/mylink";

export const LOCAL_STORAGE_KEY = "mylink_state_v1";

/** 백엔드 Mock API 전체 응답 페이로드 (src/mocks/mylink-mock.json) */
export const MOCK_API_RESPONSE = mockJson as MyLinkMockApiResponse;

export const DUMMY_PROFILE: MyLinkProfileData = MOCK_API_RESPONSE.data.profile;

export const DUMMY_SOCIAL_BADGES: SocialBadgeItem[] =
  MOCK_API_RESPONSE.data.socialBadges;

export const DUMMY_LINK_SECTIONS: LinkSectionItem[] =
  MOCK_API_RESPONSE.data.linkSections;

/** 단일 평탄화 링크 배열이 필요한 컴포넌트에서 사용할 수 있는 더미 링크 목록 */
export const DUMMY_FLAT_LINKS: LinkCardItem[] = DUMMY_LINK_SECTIONS.flatMap(
  (section) => section.links
);

export const DEFAULT_MYLINK_DATA: MyLinkData = MOCK_API_RESPONSE.data;

/**
 * 백엔드 Mock API (/api/links) 호출 헬퍼 함수
 * 네트워크/서버 환경에 관계없이 실패 시 로컬 JSON 데이터로 안전하게 폴백합니다.
 */
export async function fetchMockMyLinkData(): Promise<MyLinkMockApiResponse> {
  try {
    const res = await fetch("/api/links", { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }
    return (await res.json()) as MyLinkMockApiResponse;
  } catch {
    return MOCK_API_RESPONSE;
  }
}
