## 프로젝트 요약 (Summary)

<aside>
Nest.JS로 CRUD, 로그인, 회원가입, 댓글 기능 구현하기
</aside>

## 목표 (Goals)

- NestJS와 TypeORM을 사용한 게시판 CRUD API 구현
- MongoDB Atlas를 활용
- 게시글 작성, 조회, 수정, 삭제 기능 완성
- 댓글 시스템 구현 (작성, 조회, 수정, 삭제)
- 회원가입 및 로그인 시스템 구현
- JWT 기반 인증 시스템 구현
- 비밀번호 기반 게시글 보안 기능 구현
- RESTful API 설계 및 구현
- 유효성 검사

## 계획 (Plan)

<details>
<summary><strong>유스케이스, API명세서, 기술스택 (클릭하여 펼치기)</strong></summary>

### 유스케이스 (UseCase)
![유스케이스 다이어그램](images/UseCase.png)

### API명세서 (API Specification)
![API 명세서](images/API.png)

### 기술 스택 (Tech Stack)
- **Backend Framework**: NestJS
- **Database**: MongoDB Atlas
- **ORM**: TypeORM
- **Validation**: class-validator, class-transformer
- **Authentication**: JWT (jsonwebtoken), Passport
- **Password Hashing**: bcrypt
- **Language**: TypeScript

</details>

### 아키텍처 설계

<details>
<summary><strong>1. 데이터베이스 설계 (클릭하여 펼치기)</strong></summary>

#### 1. 데이터베이스 설계
```
users 컬렉션:
{
  _id: ObjectId,
  nickname: String,         // 닉네임 (고유값)
  password: String,         // bcrypt로 암호화된 비밀번호
  name: String,             // 사용자 이름
  createdAt: Date,          // 가입일
  updatedAt: Date           // 수정일
}

posts 컬렉션:
{
  _id: ObjectId,
  title: String,           // 제목
  content: String,         // 내용
  password: String,        // bcrypt로 암호화된 게시글 비밀번호
  userNickname: String,    // 작성자 닉네임 (JWT에서 추출)
  createdAt: Date,         // 작성시간
  updatedAt: Date          // 수정시간
}

comments 컬렉션:
{
  _id: ObjectId,
  boardId: String,         // 게시글 ID
  content: String,         // 댓글 내용
  userNickname: String,    // 작성자 닉네임 (JWT에서 추출)
  createdAt: Date,         // 작성시간
  updatedAt: Date          // 수정시간
}
```
</details>

<details>
<summary><strong>2. 프로젝트 구조 (클릭하여 펼치기)</strong></summary>

```
src/
├── auth/
│   ├── decorators/
│   │   └── user.decorator.ts      # JWT에서 사용자 정보 추출
│   ├── guards/
│   │   └── jwt-auth.guard.ts     # JWT 인증 가드
│   └── strategies/
│       └── jwt.strategy.ts       # JWT 검증 전략
├── user/
│   ├── user.entity.ts
│   ├── user.repository.ts
│   ├── user.service.ts
│   ├── user.controller.ts
│   ├── user.module.ts
│   ├── dto/
│   │   ├── signup.dto.ts
│   │   ├── signin.dto.ts
│   │   └── user-response.dto.ts
│   └── validators/
│       ├── password-validator.ts
│       └── password-match-validator.ts
├── board/
│   ├── board.entity.ts
│   ├── board.repository.ts
│   ├── board.service.ts
│   ├── board.controller.ts
│   ├── board.module.ts
│   └── dto/
│       ├── create-board.dto.ts
│       ├── update-board.dto.ts
│       └── board-response.dto.ts
├── comment/
│   ├── comment.entity.ts
│   ├── comment.repository.ts
│   ├── comment.service.ts
│   ├── comment.controller.ts
│   ├── comment.module.ts
│   └── dto/
│       ├── create-comment.dto.ts
│       ├── update-comment.dto.ts
│       └── comment-response.dto.ts
├── configs/
│   ├── jwt.config.ts
│   └── typeorm.config.ts
├── app.module.ts
└── main.ts
```
</details>

<details>
<summary><strong>3. 구현 방식 (클릭하여 펼치기)</strong></summary>

**DTO (Data Transfer Object) 활용**
- `CreateBoardDto`: 게시글 생성 시 유효성 검사
- `UpdateBoardDto`: 게시글 수정 시 유효성 검사
- `BoardResponseDto`: 응답 데이터 형식 정의

- `CreateCommentDto`: 댓글 생성 시 유효성 검사
- `UpdateCommentDto`: 댓글 수정 시 유효성 검사
- `CommentResponseDto`: 응답 데이터 형식 정의

- `SignUpDto`: 회원가입 시 유효성 검사 (닉네임, 비밀번호, 비밀번호 확인)
- `SignInDto`: 로그인 시 유효성 검사 (닉네임, 비밀번호)
- `UserResponseDto`: 사용자 응답 데이터 형식 정의

**Repository 패턴**
- TypeORM Repository를 래핑한 커스텀 Repository 클래스 구현
- 데이터베이스 접근 로직을 Service와 분리
- 재사용 가능한 데이터베이스 쿼리 메서드 제공

**TypeORM 활용**
- MongoDB 연결 및 엔티티 매핑
- 관계 설정 (사용자 ↔ 게시글 ↔ 댓글)
- 자동 타임스탬프 생성
- 쿼리 빌더를 통한 효율적인 데이터 조회

**JWT 인증 시스템**
- JWT 토큰 생성 및 검증
- Passport.js를 활용한 인증 전략
- 인증 가드를 통한 보호된 라우트 구현
- 사용자 데코레이터를 통한 JWT 정보 추출

**이중 보안 시스템**
- **1단계**: JWT 토큰으로 사용자 본인 확인
- **2단계**: 게시글 비밀번호로 추가 보안
- 게시글 수정/삭제 시 두 조건 모두 만족해야 함

**비밀번호 보안**
- bcrypt를 통한 비밀번호 해시화 (솔트 포함)
- 사용자 비밀번호와 게시글 비밀번호 모두 해시화
- 비밀번호 검증 시 bcrypt.compare() 사용

**회원가입 유효성 검사**
- 닉네임: 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)
- 비밀번호: 최소 4자 이상이며, 닉네임과 같은 값이 포함된 경우 회원가입에 실패
- 비밀번호 확인: 비밀번호와 정확하게 일치
- 닉네임 중복 검사

**로그인 보안**
- DB에서 닉네임, 비밀번호 확인
- bcrypt를 통한 비밀번호 검증
- JWT 토큰 기반 인증

**게시글 보안**
- JWT 인증 + 비밀번호 기반 게시글 수정/삭제 인증
- class-validator를 통한 입력 데이터 유효성 검사
- ObjectId 형식 검증

**댓글 보안**
- JWT 토큰으로 작성자 본인 확인
- 댓글 내용 빈 값 검증
- ObjectId 형식 검증

</details>

<details>
<summary><strong>요구사항 (클릭하여 펼치기)</strong></summary>

```
1. 전체 게시글 목록 조회 API
    - 제목, 작성자명, 작성 날짜를 조회하기
    - 작성 날짜 기준으로 내림차순 정렬하기
2. 게시글 작성 API
    - 제목, 작성자명, 비밀번호, 작성 내용을 입력하기
3. 게시글 조회 API
    - 제목, 작성자명, 작성 날짜, 작성 내용을 조회하기 
    (검색 기능이 아닙니다. 간단한 게시글 조회만 구현해주세요.)
4. 게시글 수정 API
    - API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 수정되게 하기
5. 게시글 삭제 API
    - API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 삭제되게 하기
6. 댓글 목록 조회
    - 조회하는 게시글에 작성된 모든 댓글을 목록 형식으로 볼 수 있도록 하기
    - 작성 날짜 기준으로 내림차순 정렬하기
7. 댓글 작성
    - 댓글 내용을 비워둔 채 댓글 작성 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
    - 댓글 내용을 입력하고 댓글 작성 API를 호출한 경우 작성한 댓글을 추가하기
8. 댓글 수정
    - 댓글 내용을 비워둔 채 댓글 수정 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
    - 댓글 내용을 입력하고 댓글 수정 API를 호출한 경우 작성한 댓글을 수정하기
9. 댓글 삭제
    - 원하는 댓글을 삭제하기

1. 회원 가입 API
- 닉네임, 비밀번호, 비밀번호 확인을 **request**에서 전달받기
- 닉네임은 `최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)`로 구성하기
- 비밀번호는 `최소 4자 이상이며, 닉네임과 같은 값이 포함된 경우 회원가입에 실패`로 만들기
- 비밀번호 확인은 비밀번호와 정확하게 일치하기
- 데이터베이스에 존재하는 닉네임을 입력한 채 회원가입 버튼을 누른 경우 "중복된 닉네임입니다." 라는 에러메세지를 **response**에 포함하기

2. 로그인 API
- 닉네임, 비밀번호를 **request**에서 전달받기
- 로그인 버튼을 누른 경우 닉네임과 비밀번호가 데이터베이스에 등록됐는지 확인한 뒤, 하나라도 맞지 않는 정보가 있다면 "닉네임 또는 패스워드를 확인해주세요."라는 에러 메세지를 **response**에 포함하기
- 로그인 성공 시, 로그인에 성공한 유저의 정보를 JWT를 활용하여 클라이언트에게 Cookie로 전달하기
```

</details>

<details>
<summary><strong>4. API 설계 (클릭하여 펼치기)</strong></summary>

**인증 API**
```
POST   /auth/signup         # 회원가입
POST   /auth/signin         # 로그인
```

**게시글 API**
```
GET    /board              # 전체 게시글 목록 조회
GET    /board/:id          # 특정 게시글 조회
POST   /board              # 게시글 작성 (JWT 인증 필요)
PATCH  /board/:id          # 게시글 수정 (JWT 인증 + 비밀번호 확인)
DELETE /board/:id          # 게시글 삭제 (JWT 인증 + 비밀번호 확인)
```

**댓글 API**
```
GET    /comments/board/:boardId # 게시글의 댓글 목록 조회
POST   /comments              # 댓글 작성 (JWT 인증 필요)
PATCH  /comments/:id          # 댓글 수정 (JWT 인증 필요)
DELETE /comments/:id          # 댓글 삭제 (JWT 인증 필요)
```
</details>

<details>
<summary><strong>5. 보안 및 유효성 검사 (클릭하여 펼치기)</strong></summary>

**JWT 인증 시스템**
- JWT 토큰 기반 사용자 인증
- Passport.js JWT 전략을 통한 토큰 검증
- 인증 가드를 통한 보호된 라우트 구현
- 사용자 데코레이터를 통한 JWT 정보 추출

**이중 보안 시스템**
- **1단계**: JWT 토큰으로 사용자 본인 확인
- **2단계**: 게시글 비밀번호로 추가 보안
- 게시글 수정/삭제 시 두 조건 모두 만족해야 함

**비밀번호 보안**
- bcrypt를 통한 비밀번호 해시화 (솔트 포함)
- 사용자 비밀번호와 게시글 비밀번호 모두 해시화
- 비밀번호 검증 시 bcrypt.compare() 사용

**회원가입 유효성 검사**
- 닉네임: 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)
- 비밀번호: 최소 4자 이상이며, 닉네임과 같은 값이 포함된 경우 회원가입에 실패
- 비밀번호 확인: 비밀번호와 정확하게 일치
- 닉네임 중복 검사

**로그인 보안**
- DB에서 닉네임, 비밀번호 확인
- bcrypt를 통한 비밀번호 검증
- JWT 토큰 기반 인증

**게시글 보안**
- JWT 인증 + 비밀번호 기반 게시글 수정/삭제 인증
- class-validator를 통한 입력 데이터 유효성 검사
- ObjectId 형식 검증

**댓글 보안**
- JWT 토큰으로 작성자 본인 확인
- 댓글 내용 빈 값 검증
- ObjectId 형식 검증

</details>

<details>
<summary><strong>6. 에러 처리 (클릭하여 펼치기)</strong></summary>

#### 6. 에러 처리
- 400 Bad Request: 잘못된 요청 데이터, 유효성 검사 실패, ObjectId 형식 오류
- 401 Unauthorized: JWT 인증 실패, 비밀번호 불일치, 권한 없음
- 404 Not Found: 리소스를 찾을 수 없음
- 409 Conflict: 중복된 닉네임
- 500 Internal Server Error: 서버 내부 오류

</details>

<details>
<summary><strong>7. API 응답 예시 (클릭하여 펼치기)</strong></summary>

**회원가입 성공:**
```json
{
  "message": "회원가입 성공",
  "statusCode": 200
}
```

**로그인 성공:**
```json
{
  "message": "로그인 성공",
  "statusCode": 200,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "685e83429d0cfbee3395373d",
    "nickname": "test1",
    "name": "test1"
  }
}
```

**게시글 생성:**
```json
{
  "_id": "685e970c90c1659d296e7c4d",
  "title": "게시글 제목",
  "content": "게시글 내용",
  "userNickname": "test1",
  "createdAt": "2025-06-27T13:05:16.595Z",
  "updatedAt": "2025-06-27T13:05:16.595Z"
}
```

**댓글 목록:**
```json
[
  {
    "_id": "685e9b7935a6f369b8533f53",
    "content": "댓글 내용",
    "userNickname": "test1",
    "boardId": "685e9786b1314d523fb57998",
    "createdAt": "2025-06-27T13:24:09.945Z",
    "updatedAt": "2025-06-27T13:24:09.945Z"
  }
]

</details>