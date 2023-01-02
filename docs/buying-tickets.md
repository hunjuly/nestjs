# Buying Tickets

https://plantuml.com/ko/sequence-diagram

actor : user
goal : 사용자가 영화 티켓을 구매한다.
preconditions : 사용자는 회원 가입 및 로그인 상태다.
main flow:

1.  사용자가 현재 상영중인 영화를 선택한다.
    -   영화 목록은 주간 순위, 월간 순위, 개봉일자로 정렬된다.
    -   영화를 선택하면 시놉시스, 사용자 후기 등 상세 정보를 볼 수 있다.
    -   검색을 통해서 과거에 상영했던 영화를 볼 수 있다.
1.  극장을 선택한다.
    -   선택한 영화를 상영 중인 극장만 보여준다
    -   사용자의 현재 위치에서 가까운 극장을 추천한다.
    -   반경 5km의 모든 극장. 없으면 가장 가까운 극장 5개
    -   지역을 선택하면 해당하는 극장 전체를 보여준다.
    -   지역은 여러단계로 이루어진다. 극장 목록을 보여주는 것은 마지막 단계다.
1.  상영 시간을 선택한다.
    -   매진되어 좌석이 없는 시간은 흐리게 표현한다.
1.  좌석을 선택한다.
    -   좌석은 등급과 종류가 있다.(로얄석, 커플석)
    -   좌석을 선택하면 10분 동안 선점 상태가 된다. 결제를 하기 전에 다른 사용자가 티켓을 구매하는 것을 막는다.
1.  결제한다.
    -   카드결제는 PaymentGateway 서비스를 사용한다.
1.  완료

    -   결제까지 성공하면 구매한 티켓 정보를 보여준다.

### 메소드를 weeklyRanking로 해도 될까?

이것은 weekly를 속성으로 볼 것인가? 대상으로 볼 것인가?
여기서는 속성으로 판단했다.
ranking은 영화 외에도 극장, 연령 등 다양하다.
ranking('weekly','movie') 이와 같이 확장될 수 있다.

###

TheatersService는 scheduleRepo을 포함한다.
`const theaters = schedule.findTheatersByMovie(movieId)` 를 해야 한다.

###

ScheduleService는 TicketsRepo를 포함해야 한다.
회차 당 남은 티켓수를 보여줘야 한다.

###

TicketsService의 데이터는
영화수*극장수*좌석수*회차*상영기간
만큼 생성된다. 엄청나게 많은 데이터다.

###

back <-- orders: 주문 정보(orderId)
orderId 리턴할 때 포인트/쿠폰 등 결제 관련 정보도 함께 리턴한다.
PointService, CouponService 로 나눌 것인가?
둘은 나누는 것이 좋다. 각각은 성격이 다른 entity이다.

###

이벤트인가? 메소드인가?
티켓이 업데이트 됐다는 정보는 이벤트로 했다. Statistics에서 사용한다.
PaymentService는 OrderService와 밀접한 관계가 있어서 직접 호출했다.
그러나 티켓 입장에서는 어떤 서비스에 업데이트 해야 하는지 모른다.
Order와 Ticket도 밀접한 관계가 있기 때문에 직접 호출했다.

```plantuml
@startuml
' skinparam shadowing false
skinparam defaultFontSize 11

actor user as "User"
control front as "Front-end"
boundary back as "Back-end"
collections stats as "Statistics" #fff
collections movies
collections theaters
collections schedules
collections tickets
collections orders
collections payments
queue events

note over stats
요구사항이 있어서 표시는 했으나
구현 우선 순위는 낮다.
end note

user -> front: 영화 선택 화면
front -> back: 상영 중인 영화 목록
back -[#gray]> stats: <font color=gray>ranking(weekly)</font>
note right: 1차에서는 구현하지 않는다.
back -[#red]> movies: <font color=red>listAll(임시)</font>
front <-- back: 영화 목록(movieList)
user -> front: 영화 선택
front -> back: 영화 정보(movieId)
back -> movies: movieId
front <-- back: a movie
user -> front: 예매 시작
front -> back: 극장 목록(movieId, 현재위치)
back -> theaters: movieId, location
activate theaters
theaters -> theaters: getThearters(location, 5km)
deactivate
return thearterIds[]
theaters -> schedules: movieId, theaterId
theaters <-- schedules: 상영일[]
back <-- theaters: theaters(movieId, 상영일[])
front <-- back: theaters(movieId, 상영일[])
user -> front: 극장 선택(theaterId)
user -> front: 날짜 선택(date)
front -> back: 회차 목록(theaterId,movieId,date)
back -> schedules: theaterId, movieId, date
back <-- schedules: rounds(시간, 남은 티켓 수)
front <-- back: rounds(시간,남은 티켓 수)
user -> front: 회차 선택(roundId)
front -> back: 티켓 목록(roundId)
back -> tickets: 티켓 목록(roundId)
back <-- tickets: tickets(좌석 수 만큼 있다)
front <-- back: 티켓 목록
user -> front: 티켓 선택(ticketId)
front -> back: 주문 생성, 티켓(ticketId[]) 선점
back -> orders: ticketId[]
tickets <- orders: hold(10min, ticketId)
back <-- orders: 주문 정보(orderId)
front <-- back: 주문 정보(orderId)
user -> front: 결제(orderId, coupon, cardInfo)
front -> back: 결제(orderId, coupon, cardInfo)
back -> payments: 결제(orderId, coupon, cardInfo)
orders <- payments: 결제 성공(orderId)
tickets <- orders: paid(ticketId)
tickets ->> events: sold tickets
back <-- payments: 결제 성공(orderId)
front <-- back: 결제 성공(orderId)
user <-- front: 구매완료화면
@enduml
```
