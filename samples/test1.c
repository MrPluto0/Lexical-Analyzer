// 123
int main()
{
    int a = 1, b = 0;
    while (a < 100)
    {
        a += (b && 1);
        b -= a;
        if (a == 60)
        {
            // a = 60 时记录一下
            printf("a=60");
        }
    }
    return 0;
}