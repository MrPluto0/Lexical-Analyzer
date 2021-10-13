/*
	Name: Gypsophlia
	Date: 19/03/20 21:45
	Description:
*/
#include <stdio.h>
#include <string.h>
int check(char story[], int len, char dic[][11], int num);
int main()
{
	int num = 0, len = 0;
	//字典存单词，进行检验
	char dic[11][11], ch, story[105];
	FILE *fp = fopen("dict.dic", "r");
	while (!feof(fp))
	{
		fgets(dic[num], 11, fp);
		if (dic[num][strlen(dic[num]) - 1] == '\n')
			dic[num][strlen(dic[num]) - 1] = '\0';
		num++;
	}
	//get一次得到一行字符串，然后输入换行符，再次进入循环！
	//注意每一行结尾一定要输入换行符！否则数组越界！导致未知错误！
	while (gets(story))
	{
		for (len = 0; len < strlen(story); len++)
		{
			int del = check(story, len, dic, num);
			if (del != 0)
			{
				printf("!@#$%^&*");
				//del-1是因为 再次循环的时候len还会加一！
				len += del - 1;
			}
			else
				printf("%c", story[len]);
		}
		//每处理一个，就换行！
		printf("\n");
	}
	fclose(fp);
	return 0;
}
int check(char story[], int len, char dic[][11], int num)
{
	int del;
	char s[11];
	for (int i = 0; i < 10; i++)
	{
		s[i] = story[len + i];
		s[i + 1] = '\0';
		//s[i]存的是地址，因此比较短的字符串的时候，给后一位取结束符！！
		for (int j = 0; j < num; j++)
		{
			if (strcmp(s, dic[j]) == 0)
				return i + 1;
		}
	}
	return 0;
}
