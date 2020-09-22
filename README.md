# kgsql
# 欲しい機能
- オンラインセーブ
- エディタ
- テスト
# 使いそうなやつ
- Ace
  - https://ace.c9.io/
  - https://stackoverflow.com/questions/28785588/how-to-get-the-ace-editor-to-adjust-to-its-parent-div

# 素数のやつ
```sql
with
range as (select 2 as x union all select x + 1 from range where range.x < 100),
mat as (
  select
  min(range1.x) as x,
  count(range1.x) as cnt
  from range as range1
  join range as range2
  on range1.x >= range2.x and range1.x % range2.x = 0
  group by range1.x
)
select mat.x as 'prime number' from mat where mat.cnt = 1;
```
