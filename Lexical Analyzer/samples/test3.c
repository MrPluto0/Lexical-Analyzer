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
	//�ֵ�浥�ʣ����м���
	char dic[11][11], ch, story[105];
	FILE *fp = fopen("dict.dic", "r");
	while (!feof(fp))
	{
		fgets(dic[num], 11, fp);
		if (dic[num][strlen(dic[num]) - 1] == '\n')
			dic[num][strlen(dic[num]) - 1] = '\0';
		num++;
	}
	//getһ�εõ�һ���ַ�����Ȼ�����뻻�з����ٴν���ѭ����
	//ע��ÿһ�н�βһ��Ҫ���뻻�з�����������Խ�磡����δ֪����
	while (gets(story))
	{
		for (len = 0; len < strlen(story); len++)
		{
			int del = check(story, len, dic, num);
			if (del != 0)
			{
				printf("!@#$%^&*");
				//del-1����Ϊ �ٴ�ѭ����ʱ��len�����һ��
				len += del - 1;
			}
			else
				printf("%c", story[len]);
		}
		//ÿ����һ�����ͻ��У�
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
		//s[i]����ǵ�ַ����˱Ƚ϶̵��ַ�����ʱ�򣬸���һλȡ����������
		for (int j = 0; j < num; j++)
		{
			if (strcmp(s, dic[j]) == 0)
				return i + 1;
		}
	}
	return 0;
}
